package com.challenge.auth.controller;

import com.challenge.auth.model.User;
import com.challenge.auth.payload.request.LoginRequest;
import com.challenge.auth.payload.request.SignupRequest;
import com.challenge.auth.payload.response.JwtResponse;
import com.challenge.auth.payload.response.MessageResponse;
import com.challenge.auth.repository.UserRepository;
import com.challenge.auth.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	JwtUtils jwtUtils;

	@Autowired
	PasswordEncoder encoder;

	@Value("${app.jwtRefreshExpirationMs}")
	private int jwtRefreshExpirationMs;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication.getName());
		String refreshToken = jwtUtils.generateTokenFromEmail(authentication.getName(), jwtRefreshExpirationMs);

		UserDetails userDetails = (UserDetails) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, refreshToken, null, userDetails.getUsername(), roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()),
				"ROLE_USER");

		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
		String refreshToken = request.get("refreshToken");
		if (refreshToken != null && jwtUtils.validateJwtToken(refreshToken)) {
			String email = jwtUtils.getEmailFromJwtToken(refreshToken);
			String newAccessToken = jwtUtils.generateJwtToken(email);
			return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
	}

	// SSO Simulation
	@GetMapping("/sso")
	public ResponseEntity<Void> ssoLogin() {
		// Simulating a redirect to an external SSO provider
		// In a real scenario, this would be a redirect to the provider's authorize endpoint
		String code = "Simulated_SSO_Code_123";
		// The browser is redirected back to our callback endpoint
		String redirectUrl = "http://localhost:4200/sso/callback?code=" + code;
		
		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(URI.create(redirectUrl));
		return new ResponseEntity<>(headers, HttpStatus.FOUND);
	}

	@GetMapping("/sso/callback")
	public ResponseEntity<?> ssoCallback(@RequestParam String code) {
		if ("Simulated_SSO_Code_123".equals(code)) {
			// Simulating user lookup/creation from SSO info
			String email = "sso_user@example.com";
			String jwt = jwtUtils.generateJwtToken(email);
			String refreshToken = jwtUtils.generateTokenFromEmail(email, jwtRefreshExpirationMs);
			
			return ResponseEntity.ok(new JwtResponse(jwt, refreshToken, null, email, List.of("ROLE_USER")));
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid SSO Code");
	}
}
