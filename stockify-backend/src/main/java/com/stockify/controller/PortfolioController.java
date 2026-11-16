package com.stockify.controller;

import com.stockify.dto.PortfolioRequest;
import com.stockify.model.PortfolioItem;
import com.stockify.model.User;
import com.stockify.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<List<PortfolioItem>> getPortfolio(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(portfolioService.getUserPortfolio(user.getId()));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getPortfolioSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(portfolioService.getPortfolioSummary(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addToPortfolio(@AuthenticationPrincipal User user,
                                            @Valid @RequestBody PortfolioRequest request) {
        try {
            PortfolioItem item = portfolioService.addToPortfolio(user.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeFromPortfolio(@AuthenticationPrincipal User user,
                                                  @PathVariable Long itemId) {
        portfolioService.removeFromPortfolio(user.getId(), itemId);
        return ResponseEntity.ok(Map.of("message", "Item removed from portfolio"));
    }
}
