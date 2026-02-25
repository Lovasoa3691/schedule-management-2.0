using edt_api.dtos;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/niveau")]
public class NiveauController: ControllerBase
{
    private readonly INiveau _service;

    public NiveauController(INiveau service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NiveauDto>>> GetAll()
        => Ok(await _service.getAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<NiveauDto>> GetById(int id)
    {
        var res = await _service.getByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<NiveauDto>> Create([FromBody] CreateNiveauDto dto)
    {
       
        var created = await _service.createAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.idNiv }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateNiveauDto dto)
    {
        var ok = await _service.updateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.deleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}