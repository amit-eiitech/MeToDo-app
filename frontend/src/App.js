import React from "react";
import "./App.css";

//App.use("/static", express.static("./static/"));

class App extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     todoList: [],
  //     activeItem: {
  //       id: null,
  //       title: "",
  //       completed: false,
  //     },
  //     editing: false,
  //   };

  //   this.handleChage = this.handleChage.bind(this);
  //   this.handleSubmit = this.handleSubmit.bind(this);
  // }

  state = {
    todoList: [],
    activeItem: {
      id: null,
      title: "",
      completed: false,
    },
    editing: false,
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching data...");

    const url = "http://127.0.0.1:8000/api/task-list/";
    fetch(url)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  handleChage = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // HANDLE SUBMIT
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    const csrftoken = this.getCookie("csrftoken");
    var url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  };

  // START EDIT TASK
  startEdit = (task) => {
    this.setState({
      activeItem: task,
      editing: true,
    });
  };

  // DELETE TASK
  deleteItem = (task) => {
    const csrftoken = this.getCookie("csrftoken");
    var url = `http://127.0.0.1:8000/api/task-delete/${task.id}/`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  };

  // TOGGLE STRIKE
  toggleStrike = (task) => {
    task.completed = !task.completed;
    console.log("TASK:", task.completed);

    const csrftoken = this.getCookie("csrftoken");
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(task),
    }).then((response) => {
      this.fetchTasks();
    });
  };

  render() {
    var tasks = this.state.todoList;
    var self = this;
    return (
      <div className="container">
        <h2>Me ToDo App</h2>
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit} className="d-flex">
              <div style={{ flex: 6 }}>
                <input
                  className="form-control"
                  onChange={this.handleChage}
                  value={this.state.activeItem.title}
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Add task"
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  className="btn btn-success"
                  id="submit"
                  type="submit"
                  name="Add"
                />
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {tasks.map(function (task, index) {
              return (
                <div key={index} className="task-wrapper d-flex">
                  <div
                    style={{ flex: 6 }}
                    onClick={() => {
                      self.toggleStrike(task);
                    }}
                  >
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>

                  <div style={{ flex: 1, padding: "0 5px" }}>
                    <button
                      onClick={() => {
                        self.startEdit(task);
                      }}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => {
                        self.deleteItem(task);
                      }}
                      className="btn btn-sm btn-outline-danger"
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
