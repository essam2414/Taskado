package bham.team.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserPreferences.
 */
@Entity
@Table(name = "user_preferences")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserPreferences implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "dark_mode")
    private Boolean darkMode;

    @Column(name = "sidebar_color_light")
    private String sidebarColorLight;

    @Column(name = "sidebar_color_dark")
    private String sidebarColorDark;

    @Column(name = "accent_color")
    private String accentColor;

    @Column(name = "font_size_level")
    private Integer fontSizeLevel;

    @Column(name = "dyslexia_mode")
    private Boolean dyslexiaMode;

    @Column(name = "high_contrast")
    private Boolean highContrast;

    @Column(name = "reduce_motion")
    private Boolean reduceMotion;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserPreferences id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getDarkMode() {
        return this.darkMode;
    }

    public UserPreferences darkMode(Boolean darkMode) {
        this.setDarkMode(darkMode);
        return this;
    }

    public void setDarkMode(Boolean darkMode) {
        this.darkMode = darkMode;
    }

    public String getSidebarColorLight() {
        return this.sidebarColorLight;
    }

    public UserPreferences sidebarColorLight(String sidebarColorLight) {
        this.setSidebarColorLight(sidebarColorLight);
        return this;
    }

    public void setSidebarColorLight(String sidebarColorLight) {
        this.sidebarColorLight = sidebarColorLight;
    }

    public String getSidebarColorDark() {
        return this.sidebarColorDark;
    }

    public UserPreferences sidebarColorDark(String sidebarColorDark) {
        this.setSidebarColorDark(sidebarColorDark);
        return this;
    }

    public void setSidebarColorDark(String sidebarColorDark) {
        this.sidebarColorDark = sidebarColorDark;
    }

    public String getAccentColor() {
        return this.accentColor;
    }

    public UserPreferences accentColor(String accentColor) {
        this.setAccentColor(accentColor);
        return this;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public Integer getFontSizeLevel() {
        return this.fontSizeLevel;
    }

    public UserPreferences fontSizeLevel(Integer fontSizeLevel) {
        this.setFontSizeLevel(fontSizeLevel);
        return this;
    }

    public void setFontSizeLevel(Integer fontSizeLevel) {
        this.fontSizeLevel = fontSizeLevel;
    }

    public Boolean getDyslexiaMode() {
        return this.dyslexiaMode;
    }

    public UserPreferences dyslexiaMode(Boolean dyslexiaMode) {
        this.setDyslexiaMode(dyslexiaMode);
        return this;
    }

    public void setDyslexiaMode(Boolean dyslexiaMode) {
        this.dyslexiaMode = dyslexiaMode;
    }

    public Boolean getHighContrast() {
        return this.highContrast;
    }

    public UserPreferences highContrast(Boolean highContrast) {
        this.setHighContrast(highContrast);
        return this;
    }

    public void setHighContrast(Boolean highContrast) {
        this.highContrast = highContrast;
    }

    public Boolean getReduceMotion() {
        return this.reduceMotion;
    }

    public UserPreferences reduceMotion(Boolean reduceMotion) {
        this.setReduceMotion(reduceMotion);
        return this;
    }

    public void setReduceMotion(Boolean reduceMotion) {
        this.reduceMotion = reduceMotion;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserPreferences user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserPreferences)) {
            return false;
        }
        return getId() != null && getId().equals(((UserPreferences) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserPreferences{" +
            "id=" + getId() +
            ", darkMode='" + getDarkMode() + "'" +
            ", sidebarColorLight='" + getSidebarColorLight() + "'" +
            ", sidebarColorDark='" + getSidebarColorDark() + "'" +
            ", accentColor='" + getAccentColor() + "'" +
            ", fontSizeLevel=" + getFontSizeLevel() +
            ", dyslexiaMode='" + getDyslexiaMode() + "'" +
            ", highContrast='" + getHighContrast() + "'" +
            ", reduceMotion='" + getReduceMotion() + "'" +
            "}";
    }
}
