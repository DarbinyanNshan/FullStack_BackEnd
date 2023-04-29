const Task = require("../modals/task");
const { validationResult } = require('express-validator')

exports.creatTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const data = req.body;
    const createdAt = req.body.createdAt
    const userTask = {
        userId: req.body.id,
        title: data.title,
        description: data.description,
        assigned: data.assigned,
        status: data.status,
        createdAt: createdAt
    }
    const task = new Task(userTask);
    task.save()
        .then((result) => {
            console.log(result);
            res.status(201).json(result)
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ messege: 'Error creating task' })
        });

}

exports.getTasks = async (req, res) => {
    try {
        Task.find({ userId: req.user.id })
            .then((tasks) => {
                console.log(tasks);
                res.status(200).json({ tasks })
            })
            .catch(() => {
                res.status(500).json({ message: 'Error finding post' })
            })

    } catch (err) {
        return res.status(401).send('Invalid Token')
    }
}