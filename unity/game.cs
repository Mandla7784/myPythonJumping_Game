
using System;
using System.Drawing;
using System.Windows.Forms;

public class GameForm : Form
{
    private Player player;
    private Timer gameTimer;
    private const float Gravity = 0.8f;
    private readonly int canvasWidth = 800;
    private readonly int canvasHeight = 450;

    public GameForm()
    {
        // Form setup
        Text = "Box Game";
        Width = canvasWidth;
        Height = canvasHeight;
        DoubleBuffered = true; // Reduces flicker

        // Initialize Player
        player = new Player
        {
            X = 50,
            Y = canvasHeight - 50, // Start player on the ground
            Width = 50,
            Height = 50,
            Color = Color.Blue,
            Speed = 2,
            VelocityY = 0,
            IsJumping = false,
            JumpStrength = 15
        };

        // Game Timer (Game Loop)
        gameTimer = new Timer();
        gameTimer.Interval = 16; // Approx. 60 FPS
        gameTimer.Tick += GameLoop;
        gameTimer.Start();

        // Event Handlers
        this.Paint += OnPaint;
        this.KeyDown += OnKeyDown;
    }

    private void GameLoop(object sender, EventArgs e)
    {
        // --- Update Game Logic ---

        // Apply gravity
        player.VelocityY += Gravity;
        player.Y += player.VelocityY;

        // Ground collision detection
        if (player.Y + player.Height > canvasHeight)
        {
            player.Y = canvasHeight - player.Height; // Snap to ground
            player.VelocityY = 0;
            player.IsJumping = false;
        }

        // Move the player horizontally
        if (player.X + player.Width < canvasWidth)
        {
            player.X += player.Speed;
        }
        else
        {
            // Reset position if it goes off-screen to keep moving
            player.X = -player.Width;
        }

        // --- Trigger a Redraw ---
        this.Invalidate();
    }

    private void OnPaint(object sender, PaintEventArgs e)
    {
        // --- Drawing Logic ---
        Graphics graphics = e.Graphics;
        graphics.Clear(Color.WhiteSmoke); // Clear the screen

        // Draw Player
        using (var brush = new SolidBrush(player.Color))
        {
            graphics.FillRectangle(brush, player.X, player.Y, player.Width, player.Height);
        }
    }

    private void OnKeyDown(object sender, KeyEventArgs e)
    {
        // --- Input Handling ---
        if (e.KeyCode == Keys.Enter && !player.IsJumping)
        {
            player.VelocityY = -player.JumpStrength;
            player.IsJumping = true;
        }
    }

    // Main entry point for the application
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new GameForm());
    }
}

/// <summary>
/// Represents the player in the game.
/// </summary>
public class Player
{
    public float X { get; set; }
    public float Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public Color Color { get; set; }
    public float Speed { get; set; }
    public float VelocityY { get; set; }
    public bool IsJumping { get; set; }
    public float JumpStrength { get; set; }
}
