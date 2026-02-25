using edt_api.dtos;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/matiere")]
public class MatiereController: ControllerBase
{
    private readonly IMatiere _service;

    public MatiereController(IMatiere service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MatiereDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<MatiereDto>> GetById(string id)
    {
        var res = await _service.GetByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<MatiereDto>> Create([FromBody] CreateMatiereDto dto)
    {
       var created = await _service.AddAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.id }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateMatiereDto dto)
    {
        var ok = await _service.UpdateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}