package com.lurumad.todos.infrastructure.repositories

import aws.sdk.kotlin.services.dynamodb.DynamoDbClient
import aws.sdk.kotlin.services.dynamodb.model.AttributeValue
import aws.sdk.kotlin.services.dynamodb.model.PutItemRequest
import com.lurumad.todos.domain.Todo
import com.lurumad.todos.domain.TodoRepository
import java.time.LocalDateTime

class DynamoDbRepository(private val awsRegion: String) : TodoRepository {
    override suspend fun save(todo: Todo) {
        val item = mutableMapOf<String, AttributeValue>()
        item["id"] = AttributeValue.S(todo.id.value.toString())
        item["description"] = AttributeValue.S(todo.description.value)
        item["done"] = AttributeValue.Bool(false)
        item["createdAt"] = AttributeValue.S(LocalDateTime.now().toString())
        item["updatedAt"] = AttributeValue.S(LocalDateTime.now().toString())

        val request = PutItemRequest {
            tableName = "todos"
            item
        }

        DynamoDbClient { region = awsRegion }.putItem(request)
    }
}
