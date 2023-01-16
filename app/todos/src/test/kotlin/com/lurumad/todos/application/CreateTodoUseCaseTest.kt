package com.lurumad.todos.application

import com.lurumad.todos.domain.Todo
import com.lurumad.todos.domain.TodoRepository
import io.mockk.clearMocks
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CreateTodoUseCaseTest {
    private val repository: TodoRepository = mockk(relaxed = true)
    private val useCase = CreateTodoUseCase(repository)

    @BeforeEach
    fun init() {
        clearMocks(repository)
    }

    @Test
    fun `should create a todo successfully`() = runBlocking {
        useCase.create(Id, Description)
        coVerify {
            repository.save(
                Todo.from(Id, Description)
            )
        }
    }

    companion object {
        private const val Id = "87a5606f-264e-4c1c-908a-5b5bb0c59085"
        private const val Description = "buy a new video game"
    }
}