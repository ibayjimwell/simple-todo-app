from flask import Flask, render_template, request, redirect, url_for
import uuid

app = Flask(__name__)

# In-memory task list
tasks = []

@app.route("/")
def index():

    # Initialize the dasboard data
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t['completed']])
    pending_tasks = total_tasks - completed_tasks
    progress = round((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0

    # Render index template with all needed data
    return render_template("index.html", 
        tasks=tasks,
        totalTasks=total_tasks,
        completedTasks=completed_tasks,
        pendingTasks=pending_tasks,
        progress=progress
    )

@app.route("/task/add", methods=["POST"])
def add_task():

    # Get the values in a form 
    todo = request.form.get("todo")
    priority = request.form.get("priorityRate")

    # Append that in the global variable list
    if todo:
        tasks.append({
            "_id": str(uuid.uuid4()),
            "todo": todo,
            "priorityRate": priority,
            "completed": False
        })
    return redirect(url_for("index"))


@app.route("/task/complete/all", methods=["POST"])
def complete_all_tasks():

    # Mark all tasks as completed
    for task in tasks:
        task["completed"] = True
    return redirect(url_for("index"))


@app.route("/task/delete/all", methods=["POST"])
def delete_all_tasks():

    # Delete all tasks
    global tasks
    tasks = []
    return redirect(url_for("index"))


@app.route("/task/complete/<string:task_id>", methods=["POST"])
def complete_task(task_id):

    # Mark the tasks base on the provided id in url params
    for task in tasks:
        if task["_id"] == task_id:
            task["completed"] = True
            break
    return redirect(url_for("index"))


@app.route("/task/delete/<string:task_id>", methods=["POST"])
def delete_task(task_id):

    # Delete the tasks base on the provided id in url params
    global tasks
    tasks = [t for t in tasks if t["_id"] != task_id]
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
