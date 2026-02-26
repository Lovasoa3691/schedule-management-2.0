using System.Security.Claims;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using edt_api.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace edt_api.controllers;

[ApiController]
[Route("api/user")]
public class UtilisateurController : ControllerBase
{
    private readonly IUtilisateur _service;

    public UtilisateurController(IUtilisateur service )
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResponsableDto>>> GetAll()
        => Ok(await _service.getAllAsync());

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUser()
        => Ok(await _service.getAllUserAsync());

    [HttpGet("teacher/info/{id}")]
    public async Task<ActionResult<IEnumerable<ResponsableDto>>> GetInfo(string id)
        => Ok(await _service.getInfoTeacherAsync(id));

    [HttpGet("teacher")]
    public async Task<ActionResult<IEnumerable<EnseignantDto>>> GetAllTeacher()
        => Ok(await _service.getAllTeacherAsync());
    
    [HttpGet("teacher/actif")]
    public async Task<ActionResult<IEnumerable<EnseignantActiviteDto>>> GetSpecificTeacher()
        => Ok(await _service.getSpecificTeacher());

    [HttpGet("info")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetById([FromQuery] string id, [FromQuery] string role)
    {
        var res = await _service.getByIdAsync(id,  role);
        return res == null ? NotFound() : Ok(res);
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        var id = User.FindFirst("userId")?.Value;
        var user = _service.GetUtilisateurById(id);
        if (user == null) return Unauthorized();
        string role = user switch
        {
            Responsable => user.role,
            Enseignant => user.role,
            Administrateur => user.role,
            _ => "utilisateur"
        };
        return Ok(new {userId = id, userRole = role});
    }

    [HttpPost("responsable/register")]
    public async Task<ActionResult<ResponsableDto>> AddResponsable([FromBody] CreateResponsableDto dto)
    {
        var created = await _service.createAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.id }, created);
    }
    
    [HttpPost("register")]
    public async Task<ActionResult<EnseignantDto>> Register([FromBody] RegisterEnseignantDto dto)
    {
        var created = await _service.registerAsync(dto);
        if (created == null)
        {
            return NotFound(new {message= $"Email {dto.email} introuvable dans le systeme."});
        }
        return CreatedAtAction(nameof(GetById), new { id = created.id }, created);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _service.getUserConnected(dto);
        if (user == null)
            return Unauthorized("Email ou mot de passe invalide");
        
        if (dto.client == "web")
        {
            Response.Cookies.Append("jwt", user.token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(2)
            });

            return Ok(new { email = user.email, role = user.role });
        }
        
        return Ok(new
        {
            token = user.token,
            email = user.email,
            role = user.role
        });
    }
    
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt", new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return Ok(new { message = "Déconnecté avec succès" });
    }

    [HttpPost("add/teacher")]
    public async Task<ActionResult<EnseignantDto>> Create([FromBody]CreateEnseignantDto dto)
    {
        var created = await _service.addAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.id }, created);
    }
    
    [HttpPost("teacher/import")]
    public async Task<IActionResult> ImportTeacher([FromBody] List<CreateEnseignantDto> dto)
    {
        var created = await _service.importEnseignant(dto);
        return created ? Ok() : BadRequest();
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        var created = await _service.createUserAsync(dto);
        return created ? Ok() : BadRequest();
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateResponsableDto dto)
    {
        var ok = await _service.updateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }
    
    [HttpPut("teacher/{id}")]
    public async Task<IActionResult> UpdateTeacher( string id,[FromBody] UpdateEnseignantDto dto)
    {
        var ok = await _service.updateTeacherAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var ok = await _service.deleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
    
    [HttpDelete("teacher/{id}")]
    public async Task<IActionResult> DeleteTeacher(string id)
    {
        var ok = await _service.deleteTeacherAsync(id);
        return ok ? NoContent() : NotFound();
    }
}