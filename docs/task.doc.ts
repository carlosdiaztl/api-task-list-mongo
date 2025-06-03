/**
 * @swagger
 * tags:
 *   name: task
 *   description: Task management API
 * 
 * components:
 *   schemas:
 *     TaskHistory:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Date and time of the change
 *         changeType:
 *           type: string
 *           description: Type of change (e.g., "Status Changed", "Description Updated")
 *         fieldChanged:
 *           type: string
 *           nullable: true
 *           description: Name of the changed field
 *         oldValue:
 *           description: Previous value (can be any type)
 *         newValue:
 *           description: New value (can be any type)
 *         description:
 *           type: string
 *           nullable: true
 *           description: Additional description of the change

 *     Task:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Task description
 *         status:
 *           type: string
 *           enum: [Pending, InProgress, Completed, Cancelled]
 *           description: Current task status
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Task priority level
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date of the task
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: List of tags associated with the task
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskHistory'
 *           description: Task change history
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record update timestamp
 * 
 * /task:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [task]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error

 * /task/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     tags: [task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error

 * /task/create:
 *   post:
 *     summary: Create a new task
 *     tags: [task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error

 * /task/update/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task successfully updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error

 * /task/delete/{id}:
 *   delete:
 *     summary: Delete an existing task
 *     tags: [task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
