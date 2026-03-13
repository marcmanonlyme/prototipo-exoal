package com.exoal.prototipo.repository;

import com.exoal.prototipo.entity.Actividad;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ActividadSpecification {

    private ActividadSpecification() {}

    public static Specification<Actividad> withFilters(
            Long sedeId, String tipo, String titulo, LocalDate desde, LocalDate hasta, String estado) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (sedeId != null) {
                predicates.add(cb.equal(root.get("sede").get("idSede"), sedeId));
            }
            if (tipo != null && !tipo.isBlank()) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }
            if (titulo != null && !titulo.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%"));
            }
            if (estado != null && !estado.isBlank()) {
                predicates.add(cb.equal(root.get("estado"), estado));
            }
            if (desde != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("fechaInicio"), desde));
            }
            if (hasta != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("fechaInicio"), hasta));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
