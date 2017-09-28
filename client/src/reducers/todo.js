import { getTodos, createTodo, updateTodo, destroyTodo } from '../lib/todoService';

const initState = {
    todos: [],
    currentTodo: ''
};

export const TODO_ADD       = 'TODO_ADD';
export const TODOS_LOAD     = 'TODOS_LOAD';
export const CURRENT_UPDATE = 'CURRENT_UPDATE';
export const TODO_REPLACE   = 'TODO_REPLACE';
export const TODO_REMOVE    = 'TODO_REMOVE';

export const updateCurrent = (val) => ({ type: CURRENT_UPDATE, payload: val });
export const loadTodos     = (todos) => ({ type: TODOS_LOAD, payload: todos });
export const addTodo       = (todo) => ({ type: TODO_ADD, payload: todo });
export const replaceTodo   = (todo) => ({ type: TODO_REPLACE, payload: todo });
export const removeTodo    = (id) => ({ type: TODO_REMOVE, payload: id });
export const fetchTodos    = () => {
    return (dispatch) => {
        getTodos()
            .then(todos => dispatch(loadTodos(todos)));
    };
};

export const saveTodo = (name) => {
    return (dispatch) => {
        createTodo(name)
            .then(res => dispatch(addTodo(res)));
    };
};

export const toggleTodo = (id) => {
    return (dispatch, getState) => {
        const { todos } = getState().todo;
        const todo = todos.find(todo => todo.id === id);
        const toggled = { ...todo, isComplete: !todo.isComplete };
        updateTodo(toggled)
            .then(res => dispatch(replaceTodo(res)));
    };
};

export const deleteTodo = (id) => {
    return (dispatch) => {
        destroyTodo(id)
            .then(() => dispatch(removeTodo(id)));
    };
};

export const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'active':
            return todos.filter(todo => !todo.isComplete);
        case 'completed':
            return todos.filter(todo => todo.isComplete);
        default:
            return todos;
    }
};

export default (state = initState, action) => {
    let todos;
    switch (action.type) {
        case TODO_ADD:
            todos = state.todos.concat(action.payload);
            localStorage.setItem('PixelsCampTodoList', JSON.stringify(todos));
            return { ...state, currentTodo: '', todos };
        case TODOS_LOAD:
            todos = action.payload;
            localStorage.setItem('PixelsCampTodoList', JSON.stringify(todos));
            return { ...state, todos };
        case CURRENT_UPDATE:
            return { ...state, currentTodo: action.payload };
        case TODO_REPLACE:
            todos = state.todos.map(todo => todo.id === action.payload.id ? action.payload : todo);
            localStorage.setItem('PixelsCampTodoList', JSON.stringify(todos));
            return {
                ...state,
                todos
            };
        case TODO_REMOVE:
            todos = state.todos.filter(todo => todo.id !== action.payload);
            localStorage.setItem('PixelsCampTodoList', JSON.stringify(todos));
            return {
                ...state,
                todos
            };
        default:
            return state;
    }
}
