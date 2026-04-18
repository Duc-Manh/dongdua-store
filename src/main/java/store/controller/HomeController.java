package store.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;
@Controller
public class HomeController {
    @GetMapping("/")
    public String index(HttpServletRequest request, Model model) {
        model.addAttribute("title", "Tiệm nước đong đưa");
        // Lấy URL hiện tại để truyền sang HTML
        model.addAttribute("currentUrl", request.getRequestURL().toString());
        return "index";
    }
}