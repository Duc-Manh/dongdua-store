FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy file cấu hình Maven và code vào container
COPY . .
# Chạy lệnh build đóng gói file JAR (bỏ qua chạy test để build nhanh hơn)
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy file jar đã build thành công sang image chạy chính thức
COPY --from=build /app/target/*.jar app.jar
# Mở cổng 8081 (khớp với cấu hình port của anh nếu có)
EXPOSE 8080
# Lệnh khởi chạy ứng dụng, ép dùng biến PORT từ Render
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]