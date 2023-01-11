package com.lurumad.todos

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TodosApplication

fun main(args: Array<String>) {
    runApplication<TodosApplication>(*args)
}
