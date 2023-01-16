package com.lurumad.todos.application

import com.lurumad.todos.domain.Todo
import com.lurumad.todos.domain.TodoRepository

class CreateTodoUseCase(private val repository: TodoRepository) {
    suspend fun create(id: String, description: String) {
        Todo.from(id, description).let {
            repository.save(it)
        }
    }
}
