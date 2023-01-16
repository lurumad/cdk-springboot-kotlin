FROM gradle:jdk17-alpine as builder
USER root
WORKDIR /builder
ADD . /builder
RUN gradle assemble

FROM amazoncorretto:17.0.5
WORKDIR /app
EXPOSE 8080
COPY --from=builder /builder/build/libs/todos-1.0.0.jar .
CMD ["java", "-jar", "todos-1.0.0.jar"]