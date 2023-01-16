package com.lurumad.todos.domain

interface TodoRepository {
    suspend fun save(todo: Todo)
}
