        class TaskManager {
            constructor() {
                this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                this.initializeApp();
            }

            initializeApp() {
                this.setupEventListeners();
                this.updateUI();
            }

            setupEventListeners() {
                // Add Task Button
                document.getElementById('addTaskBtn').addEventListener('click', () => {
                    document.getElementById('taskModal').classList.remove('hidden');
                });

                // Cancel Button
                document.getElementById('cancelTaskBtn').addEventListener('click', () => {
                    document.getElementById('taskModal').classList.add('hidden');
                });

                // View Graph Button
                document.getElementById('viewGraphBtn').addEventListener('click', () => {
                    const graphSection = document.getElementById('graphSection');
                    graphSection.classList.toggle('hidden');
                    if (!graphSection.classList.contains('hidden')) {
                        this.updateGraph();
                    }
                });

                // Task Form
                document.getElementById('taskForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addTask();
                });

                // Search
                document.getElementById('searchInput').addEventListener('input', (e) => {
                    this.filterTasks(e.target.value);
                });
            }

            addTask() {
                const title = document.getElementById('taskTitle').value;
                const dueDate = document.getElementById('taskDueDate').value;
                const priority = document.getElementById('taskPriority').value;
                const description = document.getElementById('taskDescription').value;

                const task = {
                    id: Date.now(),
                    title,
                    dueDate,
                    priority,
                    description,
                    completed: false,
                    createdAt: new Date().toISOString()
                };

                this.tasks.push(task);
                this.saveTasks();
                this.updateUI();
                document.getElementById('taskModal').classList.add('hidden');
                document.getElementById('taskForm').reset();
            }

            deleteTask(id) {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.saveTasks();
                this.updateUI();
            }

            toggleTaskComplete(id) {
                const task = this.tasks.find(task => task.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.saveTasks();
                    this.updateUI();
                }
            }

            filterTasks(searchTerm) {
                const taskList = document.getElementById('taskList');
                taskList.innerHTML = '';
                
                const filteredTasks = this.tasks.filter(task => 
                    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchTerm.toLowerCase())
                );

                filteredTasks.forEach(task => {
                    taskList.appendChild(this.createTaskElement(task));
                });
            }

            updateUI() {
                this.updateTaskList();
                this.updateStats();
                if (!document.getElementById('graphSection').classList.contains('hidden')) {
                    this.updateGraph();
                }
            }

            updateTaskList() {
                const taskList = document.getElementById('taskList');
                taskList.innerHTML = '';
                this.tasks.forEach(task => {
                    taskList.appendChild(this.createTaskElement(task));
                });
            }

            createTaskElement(task) {
                const div = document.createElement('div');
                div.className = `todo-item bg-white p-4 rounded-lg shadow priority-${task.priority} ${task.completed ? 'opacity-60' : ''}`;
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                                onchange="taskManager.toggleTaskComplete(${task.id})">
                            <div>
                                <h3 class="font-semibold ${task.completed ? 'line-through' : ''}">${task.title}</h3>
                                <p class="text-sm text-gray-600">Due: ${task.dueDate}</p>
                            </div>
                        </div>
                        <button onclick="taskManager.deleteTask(${task.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                return div;
            }

            updateStats() {
                const now = new Date();
                document.getElementById('totalTasks').textContent = this.tasks.length;
                document.getElementById('completedTasks').textContent = 
                    this.tasks.filter(task => task.completed).length;
                document.getElementById('upcomingTasks').textContent = 
                    this.tasks.filter(task => !task.completed && new Date(task.dueDate) > now).length;
                document.getElementById('overdueTasks').textContent = 
                    this.tasks.filter(task => !task.completed && new Date(task.dueDate) < now).length;
            }

            updateGraph() {
                const ctx = document.getElementById('taskGraph').getContext('2d');
                const completedTasks = this.tasks.filter(task => task.completed).length;
                const pendingTasks = this.tasks.filter(task => !task.completed).length;

                if (this.chart) {
                    this.chart.destroy();
                }

                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'Pending'],
                        datasets: [{
                            data: [completedTasks, pendingTasks],
                            backgroundColor: ['#10b981', '#6b7280']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }

            saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }
        }

        const taskManager = new TaskManager();
