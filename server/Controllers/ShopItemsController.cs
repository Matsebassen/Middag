using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;
using MiddagApi.Services;

namespace MiddagApi.Controllers
{
    [Route("api/ShopItems")]
    [ApiController]
    public class ShopItemsController(IShopItemsService shopItemsService) : ControllerBase
    {
        // GET: api/ShopItems
        [HttpGet("{categoryId}")]
        public async Task<ActionResult<IEnumerable<ShopItemResponse>>> GetShopItems(long categoryId)
        {
            var shopItems = await shopItemsService.GetShopItemsAsync(categoryId);   
            return Ok(shopItems.Adapt<List<ShopItemResponse>>());
        }

        // GET: api/ShopItems/ingredientTypes
        [HttpGet("ingredientTypes")]
        public async Task<ActionResult<IEnumerable<IngredientType>>> GetIngredientTypes()
        {
            var ingredientTypes = await shopItemsService.GetIngredientTypesAsync();
            return Ok(ingredientTypes);
        }



        // GET: api/ShopItems/setIngredientType
        [HttpPatch("setIngredientType/{ingredientId}/{ingredientTypeId}")]
        public async Task<ActionResult<IngredientItemResponse>> SetIngredientType(long ingredientId, long ingredientTypeId)
        {

            var ingredientItem = await shopItemsService.UpdateIngredientTypeAsync(ingredientId, ingredientTypeId);
            if (ingredientItem is null)
            {
                return NotFound("Ingredient or ingredientType not found");
            }
            var response = ingredientItem.Adapt<IngredientItemResponse>();
            return Ok(response);
        }

        // PUT: api/ShopItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<ShopItemResponse>> PutShopItem(long id, ShopItemResponse item)
        {
            if (id != item.ID)
            {
                return BadRequest();
            }
            var shopItem = await shopItemsService.UpdateShopItemAsync(id, item);
            if (shopItem is null)
            {
                return NotFound("ShopItem not found");
            }
            
            return Ok(shopItem);
        }

        // PATCH: api/ShopItems/toggle/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("toggle/{id}")]
        public async Task<ActionResult<ShopItemResponse>> ToggleShopItem(long id)
        {
            var shopItem = await shopItemsService.ToggleShopItemAsync(id);
            if (shopItem is null)
            {
                return NotFound("ShopItem not found");
            }
            return Ok(shopItem);
        }

        // POST: api/ShopItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{categoryId}/{name}")]
        public async Task<ActionResult<ShopItemResponse>> PostShopItem(long categoryId, string name)
        {
            var response = await shopItemsService.CreateShopItemAsync(categoryId, name);
            return CreatedAtAction("PostShopItem", new { id = response.ID }, response);
        }

        
        // POST: api/ShopItems/addDinner/5
        [HttpPost("addDinner/{id}")]
        public async Task<ActionResult<string>> AddDinnerToList(long id)
        {
            var dinnerName = await shopItemsService.AddDinnerToListAsync(id);
            if (dinnerName is null)
            {
                return NotFound("Dinner not found");
            }

            return Ok(dinnerName + " - added!");
        }

        // DELETE: api/ShopItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShopItem(long id)
        {

            var response = await shopItemsService.DeleteShopItemAsync(id);
            if (!response)
            {
                return NotFound("ShopItem not found");
            }
            return NoContent();
        }
    }
}
