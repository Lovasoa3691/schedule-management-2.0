using edt_api.dtos;
using edt_api.models;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/salle")]
public class SalleController: ControllerBase
{
    private readonly ISalle _service;

    public SalleController(ISalle service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalleDto>>> GetAll()
        => Ok(await _service.getAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<SalleDto>> GetById(int id)
    {
        var res = await _service.getByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<SalleDto>> Create([FromBody] CreateSalleDto dto)
    {
        // var dto = new CreateSalleDto
        // (
        //     nomsalle : "1A",
        //     capacite : 20,
        //     typeSalle : "Salle de classe",
        //     localisation : "1er etage"
        // );

        var created = await _service.createAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.idsalle }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateSalleDto dto)
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