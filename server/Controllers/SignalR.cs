using Microsoft.AspNetCore.SignalR;

namespace MiddagApi.Controllers;

public class NotificationHub : Hub
{
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}