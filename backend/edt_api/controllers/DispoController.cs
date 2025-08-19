using edt_api.dtos;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/disponibilite")]
public class DispoController: ControllerBase
{
    private readonly IDisponibilite _service;

    public DispoController(IDisponibilite service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DispoDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<DispoDto>> GetById(string id)
    {
        var res = await _service.GetByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<DispoDto>> Create()
    {
        var dto = new CreateDispoDto(
            dateDispo: new DateOnly(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day),
            hDeb: new TimeOnly(DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second),
            hFin: new TimeOnly(DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second),
            codeEns: "6911ce47-c01d-4741-9486-2238cadcda0e"
        );
        
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.idDispo }, created);

        // return Ok();

        // created = await _service.addAsync(dto);
        // return CreatedAtAction(nameof(GetById), new { id = created.idMent }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateDispoDto dto)
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