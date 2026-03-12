package com.exoal.prototipo.dto;

public class LoginResponse {
    private final String token;
    private final String nombre;
    private final String role;
    private final String email;

    public LoginResponse(String token, String nombre, String role, String email) {
        this.token = token;
        this.nombre = nombre;
        this.role = role;
        this.email = email;
    }

    public String getToken() { return token; }
    public String getNombre() { return nombre; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
}
