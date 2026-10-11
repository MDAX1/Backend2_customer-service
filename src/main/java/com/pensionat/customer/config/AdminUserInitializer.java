package com.pensionat.customer.config;

import com.pensionat.customer.model.AppUser;
import com.pensionat.customer.repository.AppUserRepository;
import com.pensionat.customer.model.Customer;
import com.pensionat.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminUserInitializer(AppUserRepository appUserRepository,
                                CustomerRepository customerRepository,
                                PasswordEncoder passwordEncoder,
                                @Value("${app.admin.username}") String username,
                                @Value("${app.admin.password}") String password) {
        this.appUserRepository = appUserRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (appUserRepository.findByUsername(username).isEmpty()) {
            AppUser admin = new AppUser();
            admin.setUsername(username);
            admin.setPasswordHash(passwordEncoder.encode(password));
            appUserRepository.save(admin);
        }

        if (customerRepository.count() == 0) {
            Customer c1 = new Customer();
            c1.setFirstName("Anna");
            c1.setLastName("Lindqvist");
            c1.setEmail("anna.lindqvist@gmail.com");
            c1.setPhone("070-123 45 67");
            c1.setAddress("Storgatan 12, Stockholm");
            customerRepository.save(c1);

            Customer c2 = new Customer();
            c2.setFirstName("Erik");
            c2.setLastName("Johansson");
            c2.setEmail("erik.johansson@hotmail.com");
            c2.setPhone("073-234 56 78");
            c2.setAddress("Kungsgatan 4, Göteborg");
            customerRepository.save(c2);

            Customer c3 = new Customer();
            c3.setFirstName("Maria");
            c3.setLastName("Svensson");
            c3.setEmail("maria.svensson@outlook.com");
            c3.setPhone("076-345 67 89");
            c3.setAddress("Drottninggatan 8, Malmö");
            customerRepository.save(c3);
        }
    }
}
