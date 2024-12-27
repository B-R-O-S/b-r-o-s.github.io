        const taskList = document.getElementById('taskList');
        const taskFormModal = document.getElementById('taskFormModal');
        const taskForm = document.getElementById('taskForm');
        const taskTitleInput = document.getElementById('taskTitle');
        const taskDescriptionInput = document.getElementById('taskDescription');
        const taskDueDateInput = document.getElementById('taskDueDate');
        const taskPriorityInput = document.getElementById('taskPriority');
        const taskTagsInput = document.getElementById('taskTags');
        const taskTimeEstimateInput = document.getElementById('taskTimeEstimate');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const closeModalBtn = document.getElementById('closeModal');
        const motivationalQuote = document.getElementById('motivationalQuote');
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const upcomingTasksEl = document.getElementById('upcomingTasks');
        const overdueTasksEl = document.getElementById('overdueTasks');
        const searchInput = document.getElementById('searchInput');
        const graphSection = document.getElementById('graphSection');
        let taskData = JSON.parse(localStorage.getItem('tasks')) || [];

        // Initialize the Pikaday date picker
        new Pikaday({ field: taskDueDateInput });

        // Load motivational quote
        motivationalQuote.innerText = "Believe in yourself!";

        // Close Modal Action
        closeModalBtn.addEventListener('click', () => {
            taskFormModal.classList.remove('show');
        });

        // Open Modal
        addTaskBtn.addEventListener('click', () => {
            taskFormModal.classList.add('show');
        });

        // Handle Task Submission with Validation
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = taskTitleInput.value.trim();
            const description = taskDescriptionInput.value.trim();
            const dueDate = taskDueDateInput.value.trim();
            const priority = taskPriorityInput.value;
            const tags = taskTagsInput.value.trim().split(',').map(tag => tag.trim());
            const timeEstimate = taskTimeEstimateInput.value;

            // Validation
            let isValid = true;

            if (!title) {
                document.getElementById('taskTitleError').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('taskTitleError').classList.add('hidden');
            }

            if (!description) {
                document.getElementById('taskDescriptionError').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('taskDescriptionError').classList.add('hidden');
            }

            if (!dueDate) {
                document.getElementById('taskDueDateError').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('taskDueDateError').classList.add('hidden');
            }

            if (!isValid) return;

            const newTask = {
                title,
                description,
                dueDate,
                priority,
                tags,
                timeEstimate,
                completed: false
            };

            taskData.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(taskData)); // Save to Local Storage
            updateTaskList();
            updateStats();
            taskFormModal.classList.remove('show');
            toastr.success('Task added successfully!');
        });

        // Update Task List UI
        function updateTaskList() {
            taskList.innerHTML = ''; // Clear the current list
            taskData.forEach((task, index) => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('todo-item', 'bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'transition-transform', 'duration-300', 'transform', 'hover:scale-105', 'relative');
                if (task.completed) {
                    taskDiv.classList.add('completed');
                }
                taskDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-semibold">${task.title}</h3>
                            <p class="text-gray-600">${task.description}</p>
                            <p class="text-sm text-gray-400">Due: ${task.dueDate}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="tag text-xs py-1 px-3 rounded-lg ${task.priority === 'high' ? 'bg-red-200' : task.priority === 'medium' ? 'bg-yellow-200' : 'bg-green-200'}">${task.priority}</span>
                            <div class="dropdown relative">
                                <button class="text-gray-500 text-xs">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-content bg-white p-2 shadow-lg rounded-lg">
                                    <button class="text-blue-500 text-xs" onclick="editTask(${index})">Edit</button>
                                    <button class="text-green-500 text-xs" onclick="completeTask(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                                    <button class="text-red-500 text-xs" onclick="deleteTask(${index})">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                taskList.appendChild(taskDiv);
            });
        }

        // Update Stats
        function updateStats() {
            totalTasksEl.innerText = taskData.length;
            completedTasksEl.innerText = taskData.filter(task => task.completed).length;
            upcomingTasksEl.innerText = taskData.filter(task => !task.completed && new Date(task.dueDate) > new Date()).length;
            overdueTasksEl.innerText = taskData.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length;
        }

        // Toggle Graph Visibility
        function toggleGraphVisibility() {
            graphSection.classList.toggle('hidden');
        }

        // Delete Task
        function deleteTask(index) {
            taskData.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(taskData));
            updateTaskList();
            updateStats();
            toastr.success('Task deleted successfully!');
        }

        // Complete/Undo Task
        function completeTask(index) {
            taskData[index].completed = !taskData[index].completed;
            localStorage.setItem('tasks', JSON.stringify(taskData));
            updateTaskList();
            updateStats();
            toastr.success(taskData[index].completed ? 'Task completed!' : 'Task undone!');
        }

        // Edit Task
        function editTask(index) {
            const task = taskData[index];
            taskTitleInput.value = task.title;
            taskDescriptionInput.value = task.description;
            taskDueDateInput.value = task.dueDate;
            taskPriorityInput.value = task.priority;
            taskTagsInput.value = task.tags.join(', ');
            taskTimeEstimateInput.value = task.timeEstimate;
            taskData.splice(index, 1); // Remove task temporarily for editing
            taskFormModal.classList.add('show');
        }

        // Initial Data Load
        updateTaskList();
        updateStats();
