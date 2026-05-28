import { Worker, Job } from 'bullmq';
import { redisConnectionOptions } from '../queues/queue';
import { Assignment } from '../models/assignment.model';
import { buildOpenAIPrompt } from '../prompts/prompt';
import { generateExamPaper } from '../services/openai.service';
import { emitToAssignmentRoom } from '../socket/socket';

export const initWorker = () => {
  const worker = new Worker(
    'question-generation',

    async (job: Job) => {

      console.log("================================");
      console.log("WORKER STARTED");

      const { assignmentId } = job.data;

      console.log(
        `Processing background job ${job.id} for assignment: ${assignmentId}`
      );

      const updateProgress = async (
        progress: number,
        message: string
      ) => {

        console.log(`PROGRESS ${progress}% -> ${message}`);

        await Assignment.findByIdAndUpdate(assignmentId, {
          progress,
          progressMessage: message
        });

        emitToAssignmentRoom(assignmentId, 'generation-progress', {
          assignmentId,
          progress,
          progressMessage: message
        });
      };

      try {

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
          throw new Error(
            `Assignment with ID ${assignmentId} not found`
          );
        }

        console.log("ASSIGNMENT FOUND");

        // Set status to processing
        assignment.status = 'processing';

        await assignment.save();

        emitToAssignmentRoom(
          assignmentId,
          'generation-started',
          { assignmentId }
        );

        await updateProgress(
          10,
          'Initializing queue worker...'
        );

        await new Promise(r => setTimeout(r, 1000));

        await updateProgress(
          30,
          'Uploading and parsing criteria...'
        );

        await new Promise(r => setTimeout(r, 1000));

        await updateProgress(
          50,
          'Generating AI questions via OpenAI...'
        );

        const prompt = buildOpenAIPrompt(
          assignment.subject,
          assignment.questionTypes,
          assignment.additionalInstructions
        );

        const totalMarks =
          assignment.questionTypes.reduce(
            (sum, t) => sum + (t.count * t.marks),
            0
          );

        console.log("CALLING OPENAI");

        const result = await generateExamPaper(
          prompt,
          totalMarks
        );

        console.log("OPENAI RESPONSE RECEIVED");

        await updateProgress(
          80,
          'Structuring paper sections and difficulty levels...'
        );

        await new Promise(r => setTimeout(r, 1000));

        await updateProgress(
          95,
          'Finalizing exam paper structure...'
        );

        await new Promise(r => setTimeout(r, 500));

        // Save complete result
        assignment.status = 'completed';

        assignment.progress = 100;

        assignment.progressMessage = 'Completed';

        assignment.result = result;

        await assignment.save();

        emitToAssignmentRoom(
          assignmentId,
          'generation-completed',
          {
            assignmentId,
            assignment
          }
        );

        console.log(
          `JOB SUCCESSFULLY FINISHED FOR ASSIGNMENT: ${assignmentId}`
        );

      } catch (error) {

        console.error(
          `ERROR PROCESSING JOB FOR ASSIGNMENT ${assignmentId}:`,
          error
        );

        const errMsg =
          (error as Error).message || 'Generation failed';

        await Assignment.findByIdAndUpdate(
          assignmentId,
          {
            status: 'failed',
            progressMessage: errMsg
          }
        );

        emitToAssignmentRoom(
          assignmentId,
          'generation-failed',
          {
            assignmentId,
            error: errMsg
          }
        );

        throw error;
      }
    },

    {
      connection: redisConnectionOptions
    }
  );

  worker.on('failed', (job, err) => {

    console.error(
      `JOB ${job?.id} FAILED WITH ERROR:`,
      err
    );

  });

  console.log(
    'BullMQ Worker initialized and listening on queue.'
  );

  return worker;
};