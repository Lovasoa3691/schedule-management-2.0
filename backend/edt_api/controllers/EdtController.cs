using edt_api.dtos;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/edt")]
public class EdtController: ControllerBase
{
    private readonly IEdt _service;

    public EdtController(IEdt service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<EdtDto>>> GetAll(string id)
        => Ok(await _service.GetAllAsync(id));

    [HttpGet("filter/{id}")]
    public async Task<ActionResult<EdtDto>> GetById(string id)
    {
        var res = await _service.GetByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<EdtDto>> Create([FromBody] CreateEdtDto dto)
    {
        // Console.WriteLine("Jour : "+dto.jour);
        // return Ok();
        var created = await _service.AddAsync(dto);
         return CreatedAtAction(nameof(GetById), new { id = created.numEd }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateEdtDto dto)
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