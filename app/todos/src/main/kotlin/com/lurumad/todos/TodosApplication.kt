package com.lurumad.todos

import com.lurumad.todos.application.CreateTodoUseCase
import com.lurumad.todos.domain.TodoRepository
import com.lurumad.todos.infrastructure.repositories.DynamoDbRepository
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@SpringBootApplication
class TodosApplication

fun main(args: Array<String>) {
    runApplication<TodosApplication>(*args)
}

@Configuration
class DependencyInjectionConfig {
    @Bean
    fun todoRepository() = DynamoDbRepository(awsRegion = "us-east-1")
    @Bean
    fun createTodoUseCase(todoRepository: TodoRepository) = CreateTodoUseCase(todoRepository)
}
