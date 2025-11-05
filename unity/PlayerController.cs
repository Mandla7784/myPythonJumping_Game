
using UnityEngine;

/// <summary>
/// Handles player input (jump, color change) and physics.
/// Attach this to the Player GameObject.
/// </summary>
[RequireComponent(typeof(Rigidbody2D), typeof(SpriteRenderer))]
public class PlayerController : MonoBehaviour
{
    [Header("Gameplay")]
    public float jumpForce = 500f;
    private Rigidbody2D rb;
    private bool isGrounded = true;

    // --- Color Cycling ---
    private SpriteRenderer spriteRenderer;
    private Color[] playerColors = { Color.blue, new Color(0, 1, 0), Color.yellow, Color.magenta, new Color(1, 0.5f, 0) };
    private int colorIndex = 0;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        spriteRenderer = GetComponent<SpriteRenderer>();
        spriteRenderer.color = playerColors[colorIndex];
    }

    void Update()
    {
        // Jump input (Space or Enter) - replaces the JS keydown listener
        if (isGrounded && (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Return)))
        {
            rb.AddForce(new Vector2(0, jumpForce));
            isGrounded = false;
        }

        // Color change input (C key)
        if (Input.GetKeyDown(KeyCode.C))
        {
            colorIndex = (colorIndex + 1) % playerColors.Length;
            spriteRenderer.color = playerColors[colorIndex];
        }
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        // Check if the player has landed on the ground
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }

        // Check if the player has hit an obstacle
        if (collision.gameObject.CompareTag("Obstacle"))
        {
            GameManager.Instance.EndGame();
        }
    }
}
