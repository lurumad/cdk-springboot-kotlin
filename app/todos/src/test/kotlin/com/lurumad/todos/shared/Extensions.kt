package com.lurumad.todos.shared

import java.util.UUID

fun Int.toUUID(): UUID =
    UUID.fromString("00000000-0000-0000-a000-${this.toString().padStart(11, '0')}")
