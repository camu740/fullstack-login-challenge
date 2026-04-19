package com.challenge.auth.config;

import com.challenge.auth.model.User;
import com.challenge.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Override
	public void run(String... args) throws Exception {
		if (!userRepository.existsByEmail("admin@challenge.com")) {
			User user = new User("admin@challenge.com",
					encoder.encode("Admin123!"),
					"ROLE_USER,ROLE_ADMIN");
			userRepository.save(user);
			System.out.println("Test user created: admin@challenge.com / Admin123!");
		}
	}
}
