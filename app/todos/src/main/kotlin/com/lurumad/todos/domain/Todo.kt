package com.lurumad.todos.domain

import java.util.UUID

data class TodoId(val value: UUID) {
    companion object {
        fun fromString(id: String) = try {
            TodoId(UUID.fromString(id))
        } catch (exception: Exception) {
            throw DomainException("The <$id> is not a valid todo id")
        }
    }
}

data class TodoDescription(val value: String) {
    init {
        validate()
    }

    private fun validate() {
        if (value.isEmpty() || value.isBlank()) {
            throw DomainException("The <$value> is not a valid")
        }
    }
}

data class Todo(
    val id: TodoId,
    val description: TodoDescription
) {
    companion object {
        fun from(id: String, description: String): Todo =
            Todo(TodoId.fromString(id), TodoDescription(description))
    }
}
