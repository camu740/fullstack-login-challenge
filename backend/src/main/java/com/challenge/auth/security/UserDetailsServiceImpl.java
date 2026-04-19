package com.challenge.auth.security;

import com.challenge.auth.model.User;
import com.challenge.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

		List<SimpleGrantedAuthority> authorities = Arrays.stream(user.getRoles().split(","))
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());

		return new org.springframework.security.core.userdetails.User(
				user.getEmail(),
				user.getPassword(),
				authorities);
	}
}
