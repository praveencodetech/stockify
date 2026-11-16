package com.stockify.controller;

import com.stockify.dto.StockResponse;
import com.stockify.model.StockHistory;
import com.stockify.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<StockResponse>> getAllStocks() {
        List<StockResponse> stocks = stockService.getAllStocks();
        System.out.println("[StockController] Stocks fetched: " + stocks.size());
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StockResponse>> searchStocks(@RequestParam String q) {
        return ResponseEntity.ok(stockService.searchStocks(q));
    }

    @GetMapping("/{symbol:.+}")
    public ResponseEntity<?> getStock(@PathVariable String symbol) {
        try {
            return ResponseEntity.ok(stockService.getStockBySymbol(symbol));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{symbol:.+}/history")
    public ResponseEntity<List<StockHistory>> getStockHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(stockService.getStockHistory(symbol, days));
    }

    @GetMapping("/sectors")
    public ResponseEntity<List<String>> getSectors() {
        return ResponseEntity.ok(stockService.getAllSectors());
    }

    @GetMapping("/sector/{sector}")
    public ResponseEntity<List<StockResponse>> getStocksBySector(@PathVariable String sector) {
        return ResponseEntity.ok(stockService.getStocksBySector(sector));
    }
}
