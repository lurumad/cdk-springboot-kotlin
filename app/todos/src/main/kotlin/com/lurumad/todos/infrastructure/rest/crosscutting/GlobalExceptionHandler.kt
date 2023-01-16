package com.lurumad.todos.infrastructure.rest.crosscutting

import com.lurumad.todos.domain.DomainException
import java.net.URI
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(exception: MethodArgumentNotValidException): ProblemDetail {
        return ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Invalid request parameters"
        )
        .apply {
            title = "Bad Request"
            type = URI.create("https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400")
            setProperty("errors", exception.bindingResult.allErrors.map {
                Error((it as FieldError).field, it.defaultMessage)
            })
        }
    }

    @ExceptionHandler(DomainException::class)
    fun handleDomainExceptions(exception: DomainException): ProblemDetail {
        return ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            exception.message
        )
            .apply {
                title = "Bad Request"
                type = URI.create("https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400")
            }
    }
}

data class Error(val field: String, val message: String?)
