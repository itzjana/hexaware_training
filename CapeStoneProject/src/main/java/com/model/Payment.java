package com.model;


import com.enums.VerificationStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus paymentStatus;

    @Column(nullable = false)
    private LocalDate paymentDate;

    @OneToOne
    @JoinColumn(nullable = false)
    private Quote quote;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public VerificationStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(VerificationStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Quote getQuote() {
        return quote;
    }

    public void setQuote(Quote quote) {
        this.quote = quote;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "id=" + id +
                ", paymentStatus=" + paymentStatus +
                ", paymentDate=" + paymentDate +
                ", quote=" + quote +
                '}';
    }
}
