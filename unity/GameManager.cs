
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

/// <summary>
/// Manages the main game state, score, and UI during gameplay.
/// Attach this to an empty GameObject called "GameManager" in your Game Scene.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    // --- UI References ---
    [Header("UI Elements")]
    public Text scoreText;
    public Text finalScoreText;
    public Text playerNameText;
    public GameObject gameOverScreen;

    // --- Game State ---
    private int score;
    private bool isGameOver = false;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    void Start()
    {
        // Initialize Game
        Time.timeScale = 1; // Ensure the game is running
        isGameOver = false;
        gameOverScreen.SetActive(false); // Hide game over screen
        score = 0;

        // Set player name on UI
        if (FirebaseManager.Instance != null && FirebaseManager.Instance.PlayerProfile != null)
        {
            playerNameText.text = "Player: " + FirebaseManager.Instance.PlayerProfile.playername;
        }
        else
        {
            playerNameText.text = "Player: Guest";
        }
    }

    void Update()
    {
        if (!isGameOver)
        {
            // Increase score over time (equivalent to frameCount++ in JS)
            score++;
            scoreText.text = "Score: " + score;
        }
    }

    /// <summary>
    /// Ends the game, shows the game over screen, and saves the score.
    /// </summary>
    public void EndGame()
    {
        if (isGameOver) return; // Prevent multiple calls

        isGameOver = true;
        Time.timeScale = 0; // Pause the game

        // Show game over UI
        gameOverScreen.SetActive(true);
        finalScoreText.text = "Final Score: " + score;

        // Save the score via FirebaseManager
        if (FirebaseManager.Instance != null)
        {
            FirebaseManager.Instance.UpdateScore(score);
        }
    }

    /// <summary>
    /// Reloads the scene to play again.
    /// Linked to the "Play Again" button's OnClick event.
    /// </summary>
    public void PlayAgain()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
}
