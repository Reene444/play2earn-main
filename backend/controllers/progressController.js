const User = require('../models/User');
const Task = require('../models/Task');

exports.updateUserProgress = async (req, res) => {
    const { userId, taskId, action } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Find or create task progress for this task
        let progress = user.taskProgress.find(tp => tp.task.toString() === taskId);

        if (!progress) {
            // If no progress found, create a new entry
            progress = {
                task: taskId,
                status: 'not-started',  // Initial status when a task is first assigned
                score: task.reward
            };
            user.taskProgress.push(progress);
        }

        // Handle task starting action
        if (action === 'start' && progress.status === 'not-started') {
            progress.status = 'in-progress';  // Mark as in-progress
        }

        // Handle task completion action
        if (action === 'complete') {
            if (progress.status === 'not-started') {
                return res.status(400).json({ error: 'Task must be started before it can be completed' });
            }
            if (progress.status !== 'completed') {
                progress.status = 'completed';  // Mark as completed
                user.tasks_completed += 1;
                user.total_rewards += task.reward;
            }
        }

        progress.lastUpdated = Date.now();

        await user.save();  // Ensure save() is called after updating fields

        res.json({ message: 'User progress updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};







// Get User Progress
exports.getUserProgress = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('taskProgress.task');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ taskProgress: user.taskProgress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
