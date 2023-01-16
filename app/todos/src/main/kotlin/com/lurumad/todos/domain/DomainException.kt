package com.lurumad.todos.domain

class DomainException(
    override val message: String,
    override val cause: Throwable? = null
) : RuntimeException(message, cause)
