@component
export class ScoreUpdater extends BaseScriptComponent {

    @input
    scoreText: Text

    score: number

    onAwake() {
        this.score = 0
        this.scoreText.text = "Score: " + this.score
    }

    public updateScore() {
        this.score += .5
        this.scoreText.text = "Score: " + this.score
    }


}
