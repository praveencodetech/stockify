package com.stockify.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_logins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @PrePersist
    protected void onCreate() {
        loginTime = LocalDateTime.now();
    }
}
