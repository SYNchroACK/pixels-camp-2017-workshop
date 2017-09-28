export const getTodos = () => {
    return fetch('/todos')
        .then(res => res.json())
        .catch(() => {
            // if fetch fails, fallback to localstorage
            return JSON.parse(localStorage.getItem('PixelsCampTodoList'));
        });
};

export const createTodo = (name) => {
    return fetch('/todos', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, isComplete: false })
    })
        .then(res => res.json());
};

export const updateTodo = (todo) => {
    return fetch(`/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
        .then(res => res.json());
};

export const destroyTodo = (id) => {
    return fetch(`/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};
