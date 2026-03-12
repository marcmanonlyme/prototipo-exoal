package com.exoal.prototipo.controller;

import com.exoal.prototipo.dto.LoginRequest;
import com.exoal.prototipo.dto.LoginResponse;
import com.exoal.prototipo.entity.Usuario;
import com.exoal.prototipo.repository.UsuarioRepository;
import com.exoal.prototipo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<Usuario> opt = usuarioRepository.findByEmail(req.getEmail());
        if (opt.isEmpty() || !passwordEncoder.matches(req.getPassword(), opt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }
        Usuario usuario = opt.get();
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getTipoUsuario());
        return ResponseEntity.ok(
                new LoginResponse(token, usuario.getNombre(), usuario.getTipoUsuario(), usuario.getEmail()));
    }
}
