using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;
using Microsoft.Extensions.Configuration;
using MiddagApi.Controllers;
using MiddagApi.Services;


var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

// Configure mappings for Mapster
MappingConfig.ConfigureMappings();

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddDbContext<DinnerContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Middagdb")));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IShopItemsService, ShopItemsService>();
builder.Services.AddScoped<IDinnerService, DinnerService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}
else
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<DinnerContext>();
    context.Database.EnsureCreated();
    //DbInitializer.Initialize(context);
}

app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);
app.UseRouting();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotificationHub>("/notificationHub");
});





app.MapControllers();

app.Run();
