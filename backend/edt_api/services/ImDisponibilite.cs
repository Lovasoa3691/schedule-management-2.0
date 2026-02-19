using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using Microsoft.EntityFrameworkCore;

namespace edt_api.services;

public class ImDisponibilite : IDisponibilite
{
    
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ImDisponibilite(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<DispoDto>> GetAllAsync(string id)
    {
        var result = new List<DispoDto>();
        if (id == "all")
        {
            // var enseignants = await _db.Enseignants
            //     .Include(e => e.disponibilites)
            //     .ToListAsync();
            //
            // foreach (var enseignant in enseignants)
            // {
            //     var disposActives = enseignant.disponibilites?
            //         .Where(d => d.statusDispo == "ACTIVE")
            //         .ToList();
            //
            //     if (disposActives != null && disposActives.Any())
            //     {
            //         foreach (var dispo in disposActives)
            //         {
            //             result.Add(new DispoDto(
            //                 idDispo: dispo.numDispo,
            //                 dateDispo: dispo.dateDispo,
            //                 hDeb: dispo.hDeb,
            //                 hFin: dispo.hFin,
            //                 nomEns: enseignant.nom,
            //                 prenomEns: enseignant.prenom,
            //                 grade: enseignant.grade
            //             ));
            //         }
            //     }
            // }
            
            var enseignants = await _db.Enseignants
                .Include(e => e.disponibilites
                    .Where(d => d.statusDispo == "ACTIVE"))
                .ToListAsync();

            foreach (var enseignant in enseignants)
            {
                var disposTriees = enseignant.disponibilites?
                    .OrderBy(d => d.dateDispo)
                    .ThenBy(d => d.hDeb)
                    .ToList();

                if (disposTriees != null && disposTriees.Any())
                {
                    foreach (var dispo in disposTriees)
                    {
                        result.Add(new DispoDto(
                            idDispo: dispo.numDispo,
                            dateDispo: dispo.dateDispo,
                            hDeb: dispo.hDeb,
                            hFin: dispo.hFin,
                            nomEns: enseignant.nom,
                            prenomEns: enseignant.prenom,
                            grade: enseignant.grade
                        ));
                    }
                }
                else
                {
                    result.Add(new DispoDto(
                        idDispo: null,
                        dateDispo: default,
                        hDeb: default,
                        hFin: default,
                        nomEns: enseignant.nom,
                        prenomEns: enseignant.prenom,
                        grade: enseignant.grade
                    ));
                }
            }

        }
        else
        {
            var res = await _db.Enseignants
                .Include(e => e.disponibilites)
                .FirstOrDefaultAsync(e => e.idUt == id);
            
            if (res == null)
                return Enumerable.Empty<DispoDto>();
            
            if (res.disponibilites == null || !res.disponibilites.Any())
            {
                return new List<DispoDto>
                {
                    new DispoDto(
                        idDispo: null,
                        dateDispo: default,
                        hDeb: default,
                        hFin: default,
                        nomEns: res.nom,
                        prenomEns: res.prenom,
                        grade: res.grade
                    )
                };
            }
            foreach (var dispo in res.disponibilites)
            {
                result.Add(new DispoDto(
                    idDispo: dispo.numDispo,
                    dateDispo: dispo.dateDispo,
                    hDeb: dispo.hDeb,
                    hFin: dispo.hFin,
                    nomEns: res.nom,
                    prenomEns: res.prenom,
                    grade: res.grade
                ));
            }
        }

        return result;
    }
    
    public async Task<DispoDto?> GetByIdAsync(string id)
    {
        var res =  await _db.Disponibilites.FindAsync(id);
        return res == null ? null : _mapper.Map<DispoDto>(res);
    }

    public async Task<DispoDto> CreateAsync(CreateDispoDto dto)
    {
        var data = new Disponibilite
        {
            dateDispo = dto.dateDispo,
            hDeb = dto.hDeb,
            hFin = dto.hFin,
            enseignantId = dto.codeEns,
            statusDispo = "ACTIVE"
        };
        _db.Disponibilites.Add(data);
        await _db.SaveChangesAsync();
        return _mapper.Map<DispoDto>(data);
    }

    public async Task<bool> UpdateAsync(string id, UpdateDispoDto dto)
    {
        var res  = await _db.Disponibilites.FindAsync(id);
        if (res == null) return false;
        
        res.dateDispo = dto.dateDispo;
        res.hDeb = dto.hDeb;
        res.hFin = dto.hFin;
        res.enseignantId = dto.codeEns;
        _db.Disponibilites.Update(res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var  res = await _db.Disponibilites.FindAsync(id);
        if (res == null) return false;
        _db.Disponibilites.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
}