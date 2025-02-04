using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiddagApi.Models;

namespace MiddagApi.Controllers
{
    [Route("api/DinnerItems")]
    [ApiController]
    public class DinnerItemsController : ControllerBase
    {
        private readonly DinnerContext _context;

        public DinnerItemsController(DinnerContext context)
        {
            _context = context;
        }

        // GET: api/DinnerItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DinnerItem>>> GetDinnerItems()
        {
            var dinners = await _context.DinnerItems
                .Include(d => d.Ingredients)
                .ThenInclude(i => i.Ingredient)
                .AsNoTracking()
                .ToListAsync();;
            
            return Ok(dinners);
        }

        // GET: api/DinnerItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DinnerItem>> GetDinnerItem(long id)
        {
            var dinnerItem = await _context.DinnerItems
            .Include(d => d.Ingredients)
            .ThenInclude(i => i.Ingredient)
            .AsNoTracking()
            .SingleOrDefaultAsync(d => d.ID == id);

            if (dinnerItem == null)
            {
                return NotFound();
            }

            return dinnerItem;
        }

        // GET: api/DinnerItems/search/potet
        [HttpGet("search/{search}")]
        public async Task<ActionResult<IEnumerable<DinnerItem>>> GetDinnerItems(string search)
        {
            var dinners = await _context.DinnerItems
                .Include(d => d.Ingredients)
                .ThenInclude(i => i.Ingredient)
                .Where(d => d.Name.Contains(search) ||
                            d.Ingredients.Any(i => i.Ingredient.Name.Contains(search)))
                .ToListAsync();
            
            return Ok(dinners);
        }

        // GET: api/DinnerItems/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<DinnerItem>>> GetAllDinnerItems()
        {
            var dinners = await _context.DinnerItems
                              .Include(d => d.Ingredients)
                              .ThenInclude(i => i.Ingredient)
                              .AsNoTracking()
                              .ToListAsync();
                          
            return Ok(dinners);
        }

        // PUT: api/DinnerItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDinnerItem(long id, DinnerItem dinnerItem)
        {
            if (id != dinnerItem.ID)
            {
                return BadRequest();
            }
            _context.Entry(dinnerItem).State = EntityState.Modified;

            // Save any changes to ingredients
            if (dinnerItem.Ingredients != null)
            {

                var dinnerInDb = await _context.DinnerItems
                  .AsNoTracking()
                  .Include(d => d.Ingredients)
                  .FirstOrDefaultAsync(d => d.ID == dinnerItem.ID);

                if (dinnerInDb != null && dinnerInDb.Ingredients != null)
                {
                    // Delete any recipeItems that are removed from dinner
                    var deletedRecipeItems = dinnerInDb.Ingredients
                      .Where(i => dinnerItem.Ingredients.Any(ri => ri.ID != i.ID))
                      .ToList();

                    deletedRecipeItems.ForEach(deletedItem =>
                    {
                        _context.Entry(deletedItem).State = EntityState.Deleted;
                    });
                }

                //Check whether recipeItems are new or modified
                foreach (var recipeItem in dinnerItem.Ingredients)
                {
                    if (recipeItem.Ingredient == null || recipeItem.Ingredient.Name == null) continue;
                    
                    if (recipeItem.ID != 0)
                    {
                        // Existing recipeItem. Check if ingredient has changed
                        _context.Entry(recipeItem).State = EntityState.Modified;
                        var recipeItemInDb = _context.RecipeItem
                            .Where(r => r.ID == recipeItem.ID)
                            .Include(r => r.Ingredient)
                            .AsNoTracking()
                            .FirstOrDefault();

                        if (recipeItemInDb == null
                            || recipeItemInDb.Ingredient == null
                            || recipeItemInDb.Ingredient.Name != recipeItem.Ingredient.Name)
                        {
                            recipeItem.Ingredient = GetIngredientItem(recipeItem.Ingredient.Name);
                        }
                    }
                    else
                    {
                        // New recipeItem
                        recipeItem.Ingredient = GetIngredientItem(recipeItem.Ingredient.Name);
                        _context.Entry(recipeItem).State = EntityState.Added;
                    }
                };
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DinnerItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(dinnerItem);
        }

        private IngredientItem GetIngredientItem(string name)
        {
            var ingredient = _context.IngredientItem
              .Where(i => i.Name == name)
              .AsNoTracking()
              .FirstOrDefault();
            if (ingredient != null)
            {
                // Update to existing ingredient
                return ingredient;
            }
            else
            {
                // Create a new ingredient
                var newIngredient = new IngredientItem();
                newIngredient.ID = 0;
                newIngredient.Name = name;
                return newIngredient;
            }
        }

        // POST: api/DinnerItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DinnerItem>> PostDinnerItem(DinnerItem dinnerItem)
        {
            if (dinnerItem.Ingredients != null)
            {
                var ingredientsList = dinnerItem.Ingredients.ToList(); // Convert to List

                foreach (var recipeItem in ingredientsList)
                {
                    if (recipeItem.Ingredient != null)
                    {
                        var ingredientName = recipeItem.Ingredient.Name;
                        var ingredientItem = _context.IngredientItem.FirstOrDefault(i => i.Name == ingredientName);
                        if (ingredientItem != null)
                        {
                            recipeItem.Ingredient = ingredientItem;
                        }
                    }
                }
                dinnerItem.Ingredients = ingredientsList;
            }
            _context.DinnerItems.Add(dinnerItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDinnerItem), new { id = dinnerItem.ID }, dinnerItem);
        }

        // DELETE: api/DinnerItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDinnerItem(long id)
        {
            var dinnerItem = await _context.DinnerItems.FindAsync(id);
            if (dinnerItem == null)
            {
                return NotFound();
            }

            _context.DinnerItems.Remove(dinnerItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DinnerItemExists(long id)
        {
            return (_context.DinnerItems?.Any(e => e.ID == id)).GetValueOrDefault();
        }
    }
}
