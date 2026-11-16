package com.stockify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PortfolioRequest {
    @NotBlank(message = "Stock symbol is required")
    private String symbol;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Buy price is required")
    @Positive(message = "Buy price must be positive")
    private BigDecimal buyPrice;

    @NotNull(message = "Buy date is required")
    private LocalDate buyDate;

    private String notes;
}
