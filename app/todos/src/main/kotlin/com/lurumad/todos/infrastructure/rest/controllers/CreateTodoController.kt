package com.lurumad.todos.infrastructure.rest.controllers

import com.lurumad.todos.application.CreateTodoUseCase
import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.net.URI
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class CreateTodoController(private val createTodoUseCase: CreateTodoUseCase) {
    @PostMapping("/todos")
    suspend fun execute(@Valid @RequestBody body: TodoCreateBody): ResponseEntity<String> {
        createTodoUseCase.create(body.id, body.description)
        return ResponseEntity.created(URI.create("/todos/${body.id}")).build()
    }
}

data class TodoCreateBody(
    @field:NotEmpty(message = "Id is mandatory")
    @field:Pattern(regexp = "[a-f0-9]{8}(?:-[a-f0-9]{4}){4}[a-f0-9]{8}", message = "Id should be a valid UUID")
    val id: String,
    @field:Size(min = 5, max = 250)
    @field:NotEmpty(message = "Description is mandatory")
    val description: String
)
