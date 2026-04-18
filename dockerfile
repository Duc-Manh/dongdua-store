# Bước 1: Build dự án bằng Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy toàn bộ thư mục store vào trong container
COPY store/ .

# Thực hiện build file JAR
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng bằng Java
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy file JAR đã build từ bước trước sang
COPY --from=build /app/target/*.jar app.jar

# Mở cổng (thường là 8080 hoặc 8081 tùy cấu hình của anh)
EXPOSE 8081

# Lệnh khởi chạy
ENTRYPOINT ["java", "-jar", "app.jar"]